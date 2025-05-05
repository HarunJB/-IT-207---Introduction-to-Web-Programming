<?php
class BaseService {
    protected $dao;

    public function __construct($dao)
    {
        $this->dao = $dao;
    }

    public function getAll()
    {
        return $this->dao->getAll();
    }

    public function getById($id)
    {
        return $this->dao->getById($id);
    }

    public function add($entity)
    {
        return $this->dao->insert($entity);
    }

    public function update($id, $entity)
    {
        return $this->dao->update($id, $entity);
    }

    public function delete($id)
    {
        return $this->dao->delete($id);
    }
}
?>